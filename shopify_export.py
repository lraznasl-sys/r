"""
Shopify Product Exporter
يجلب كل المنتجات من Shopify ويرتبها في ملف Excel بالتنسيق المطلوب.

الأعمدة الناتجة:
    ID | اسم المنتج | وصف مختصر | السعر | رابط المنتج | الفئة | كلمات مفتاحية
"""

import os
import re
import sys
import requests
import pandas as pd
from dotenv import load_dotenv

# ───────────────────────────────────────────
# إعدادات
# ───────────────────────────────────────────
load_dotenv()

STORE_DOMAIN  = "lz-store-8492.myshopify.com"
ACCESS_TOKEN  = os.getenv("SHOPIFY_ACCESS_TOKEN")
API_VERSION   = "2024-01"
OUTPUT_FILE   = "products_formatted.xlsx"
MAX_KEYWORDS  = 105          # حد الكلمات المفتاحية


# ───────────────────────────────────────────
# مساعدات
# ───────────────────────────────────────────
def strip_html(html: str) -> str:
    """يزيل وسوم HTML ويعيد أول سطرين من النص."""
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = re.sub(r"\s+", " ", text).strip()
    # أول جملتين كحد أقصى
    sentences = re.split(r"(?<=[.!?؟])\s+", text)
    return " ".join(sentences[:2]).strip()


def clean_price(raw: str) -> str:
    """يحول '199.00' إلى '199'، و'99.50' يبقى '99.5'."""
    try:
        val = float(raw)
        return str(int(val)) if val == int(val) else str(val)
    except (ValueError, TypeError):
        return raw


def trim_keywords(tags: str, limit: int = MAX_KEYWORDS) -> str:
    """يبقي أول (limit) كلمة من الـ tags."""
    if not tags:
        return ""
    words = [t.strip() for t in tags.split(",") if t.strip()]
    return ", ".join(words[:limit])


# ───────────────────────────────────────────
# جلب البيانات من Shopify
# ───────────────────────────────────────────
def get_all_products() -> list:
    """يجلب جميع المنتجات مع دعم الصفحات التلقائي."""
    if not ACCESS_TOKEN:
        sys.exit(
            "خطأ: SHOPIFY_ACCESS_TOKEN غير موجود.\n"
            "أنشئ ملف .env وأضف فيه: SHOPIFY_ACCESS_TOKEN=your_token"
        )

    headers = {"X-Shopify-Access-Token": ACCESS_TOKEN}
    url     = f"https://{STORE_DOMAIN}/admin/api/{API_VERSION}/products.json"
    params  = {"limit": 250, "status": "active"}
    products = []

    while url:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code == 401:
            sys.exit("خطأ 401: الـ Token غير صحيح أو منتهي الصلاحية.")
        if resp.status_code == 403:
            sys.exit("خطأ 403: التوكن لا يملك صلاحية read_products.")
        resp.raise_for_status()

        batch = resp.json().get("products", [])
        products.extend(batch)
        print(f"  تم جلب {len(products)} منتج حتى الآن...", end="\r")

        # الصفحة التالية عبر Link header
        link  = resp.headers.get("Link", "")
        url   = None
        params = {}
        for part in link.split(","):
            if 'rel="next"' in part:
                url = part.split(";")[0].strip().strip("<>")
                break

    print()
    return products


# ───────────────────────────────────────────
# معالجة كل منتج
# ───────────────────────────────────────────
def process_product(product: dict) -> dict:
    # السعر — نأخذ أقل سعر بين جميع المتغيرات
    variants = product.get("variants", [])
    prices   = [float(v["price"]) for v in variants if v.get("price")]
    raw_price = str(min(prices)) if prices else ""

    return {
        "ID"             : product["id"],
        "اسم المنتج"    : product.get("title", ""),
        "وصف مختصر"     : strip_html(product.get("body_html", "")),
        "السعر"          : clean_price(raw_price),
        "رابط المنتج"   : f"https://{STORE_DOMAIN}/products/{product.get('handle','')}",
        "الفئة"          : product.get("product_type", ""),
        "كلمات مفتاحية" : trim_keywords(product.get("tags", "")),
    }


# ───────────────────────────────────────────
# الحفظ في Excel
# ───────────────────────────────────────────
def save_to_excel(rows: list) -> None:
    columns = [
        "ID", "اسم المنتج", "وصف مختصر", "السعر",
        "رابط المنتج", "الفئة", "كلمات مفتاحية",
    ]
    df = pd.DataFrame(rows, columns=columns)

    with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Products")

        # تنسيق عرض الأعمدة
        ws = writer.sheets["Products"]
        col_widths = {"A": 15, "B": 35, "C": 50, "D": 12, "E": 55, "F": 20, "G": 60}
        for col, width in col_widths.items():
            ws.column_dimensions[col].width = width

    print(f"تم الحفظ في: {OUTPUT_FILE}  ({len(rows)} منتج)")


# ───────────────────────────────────────────
# Main
# ───────────────────────────────────────────
def main():
    print("=== Shopify Product Exporter ===")
    print(f"المتجر  : {STORE_DOMAIN}")
    print(f"الملف   : {OUTPUT_FILE}\n")

    print("جاري جلب المنتجات...")
    products = get_all_products()
    print(f"إجمالي المنتجات: {len(products)}\n")

    rows = [process_product(p) for p in products]
    save_to_excel(rows)


if __name__ == "__main__":
    main()
