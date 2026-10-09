"""Convert the perfume list spreadsheet into the shared catalog JSON.

Usage:  python3 scripts/import_catalog.py data/perfume_list.xlsx packages/core/src/data/catalog.json

Each sheet is an oil house (ARGEVILL / LUZI / SELUZ). Only a NAMES column
exists today, so gender and scent family are inferred from the name. Once
TradeMax exposes item codes, prices and stock, `sku` is the join key and the
live values override what is generated here.
"""
import json
import re
import sys

import openpyxl

COLLECTIONS = {
    "ARGEVILL": {"id": "argeville", "code": "ARG", "label": "Argeville"},
    "LUZI": {"id": "luzi", "code": "LUZ", "label": "Luzi"},
    "SELUZ": {"id": "seluz", "code": "SLZ", "label": "Seluz"},
}

MEN = {"M", "MEN", "MAN", "HOMME", "HOM", "BOY"}
WOMEN = {"W", "WOMEN", "WOMAN", "FEMME", "LADY", "GIRL", "HER"}

# First match wins, so the most distinctive families come first.
FAMILIES = [
    ("oud", r"OUD|AOUD|OUDH|AGAR|DOKHOON|MUKHALLAT|BAKHOOR|SANDAL|TURABI"),
    ("leather", r"LEATHER|TOBACCO|CIGAR|TABAC|SMOKE|FIRE"),
    ("amber", r"AMBER|AMBRE|SAFFRON|ORIENT|NUIT|NIGHT|BLACK|NOIR|OPIUM|INTENSE|ELIXIR"),
    ("musk", r"MUSK|MUSC|POWDER|BABY|WHITE|SOFT|CASHMERE|CLEAN"),
    ("sweet", r"VANIL|CHOCO|CANDY|BUBBLE|GUM|CARAMEL|SUGAR|HONEY|SWEET|DELIC|LOLLI|CAKE|CANDIE|GOURMAND|540|ANGEL|GOOD GIRL"),
    ("fresh", r"AQUA|ACQUA|WATER|SPORT|BLEU|BLUE|COOL|OCEAN|SEA|MARINE|FRESH|CITRUS|LEMON|BERGAMOT|ORANGE|MINT|TEA|GREEN|ENERG|LIGHT|SWIM|ISLAND|AZUR|SAUVAGE|POLO"),
    ("floral", r"ROSE|JASMIN|FLOR|FLEUR|FLOWER|BLOOM|ORCHID|PEONY|LILY|TUBEROSE|IRIS|PETAL|BLOSSOM|NO\.5|CHANCE|LOVE|ROMANCE|MISS|GARDEN|COCO"),
    ("woody", r"WOOD|BOIS|CEDAR|VETIVER|PATCHOULI|FOREST|TERRE|OAK|SANTAL|VIKING|AVENTUS|CREED|GAME|SILVER|OMBRE|EGOISTE"),
]

ACRONYMS = {"YSL", "CK", "DKNY", "VIP", "II", "III", "XS", "TF", "CH", "JM", "VS", "MFK", "GIV", "XJ", "LV", "UAE", "212", "540"}

# Images supplied with the brand assets, keyed by normalised product name.
IMAGES = {
    "AMBER OUD KILIAN": "amber-oud.jpg",
    "NISHANE": "nishane.jpg",
    "JAZZ CLUB MAISON": "jazz-club.jpg",
    "OUD SATIN MOOD": "oud-satin-mood.jpg",
    "GREEN TEA": "green-mist.jpg",
}

# House blends shown in the campaign shots; not in the oil list.
SIGNATURES = [
    {"name": "Sedra Nero", "family": "leather", "gender": "men", "image": "nero.jpg", "size": 200,
     "notes": ["Smoked woods", "Charred amber", "Black pepper"]},
    {"name": "Ruby Prestige", "family": "sweet", "gender": "women", "image": "ruby-prestige.jpg", "size": 100,
     "notes": ["Red berries", "Rose", "Sparkling musk"]},
    {"name": "GIS Ellora", "family": "fresh", "gender": "unisex", "image": "ellora.jpg", "size": 100,
     "notes": ["Sun-warmed citrus", "Sea salt", "Golden amber"]},
    {"name": "You Absolutely", "family": "amber", "gender": "men", "image": "you-absolutely.jpg", "size": 100,
     "notes": ["Saffron", "Leather", "Dark resin"]},
]

FAMILY_NOTES = {
    "oud": ["Agarwood", "Saffron", "Rose"],
    "leather": ["Leather", "Tobacco leaf", "Birch smoke"],
    "amber": ["Amber", "Labdanum", "Warm spice"],
    "musk": ["White musk", "Powdery iris", "Soft woods"],
    "sweet": ["Vanilla", "Praline", "Tonka bean"],
    "fresh": ["Bergamot", "Marine accord", "Cedar"],
    "floral": ["Jasmine", "Rose", "Peony"],
    "woody": ["Sandalwood", "Vetiver", "Cedar"],
    "classic": ["Bergamot", "Heart florals", "Soft woods"],
}


def clean(raw):
    name = str(raw).replace("_x000D_", " ").replace("\r", " ").replace("\n", " ").replace("*", "")
    name = re.sub(r"\((?:LZ|TRK)\)|[-\s](?:LZ|TRK)\b", " ", name, flags=re.I)
    return re.sub(r"\s+", " ", name).strip(" -")


def word_case(word):
    if "." in word:
        return ".".join(word_case(p) for p in word.split("."))
    if "-" in word:
        return "-".join(word_case(p) for p in word.split("-"))
    up = word.upper()
    if up in ACRONYMS or (up.isalpha() and not re.search(r"[AEIOUY]", up)):
        return up
    return up[:1] + up[1:].lower().replace("'S", "'s")


def display(name):
    return " ".join(word_case(w) for w in name.split(" "))


def gender(name):
    tokens = set(re.split(r"[^A-Z0-9]+", name.upper()))
    if tokens & WOMEN:
        return "women"
    if tokens & MEN:
        return "men"
    return "unisex"


def family(name):
    for fam, pattern in FAMILIES:
        if re.search(pattern, name.upper()):
            return fam
    return "classic"


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def main(src, dest):
    wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
    products, seen = [], set()
    for sig_i, sig in enumerate(SIGNATURES, 1):
        pid = slug(sig["name"])
        seen.add(pid)
        products.append({
            "id": pid, "sku": f"SP-{sig_i:04d}", "name": sig["name"], "rawName": sig["name"].upper(),
            "collection": "signature", "gender": sig["gender"], "family": sig["family"],
            "notes": sig["notes"], "image": sig["image"], "signature": True, "defaultSize": sig["size"],
        })
    for ws in wb.worksheets:
        col = COLLECTIONS.get(ws.title.strip().upper())
        if not col:
            continue
        n = 0
        for (raw, *_) in ws.iter_rows(min_row=2, values_only=True):
            if not raw or not str(raw).strip():
                continue
            name = clean(raw)
            n += 1
            pid = slug(name)
            if pid in seen:
                pid = f"{pid}-{col['id']}"
            seen.add(pid)
            fam = family(name)
            products.append({
                "id": pid, "sku": f"{col['code']}-{n:04d}", "name": display(name), "rawName": str(raw).strip(),
                "collection": col["id"], "gender": gender(name), "family": fam,
                "notes": FAMILY_NOTES[fam], "image": IMAGES.get(name.upper()), "signature": False,
            })
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=0)
    print(f"wrote {len(products)} products -> {dest}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
