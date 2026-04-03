import json
import urllib.request

# Supabase details
SUPABASE_URL = "https://smqhfniedlkclnefbndc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcWhmbmllZGxrY2xuZWZibmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDIyNzAsImV4cCI6MjA1OTAxODI3MH0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"

headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Prefer": "resolution=merge-duplicates"
}

# Load the exported data
with open("export.json", "r") as f:
    data = json.load(f)

def upsert(table, rows):
    if not rows:
        print(f"  ⏭️  Skipping {table} (empty)")
        return
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = json.dumps(rows).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            print(f"  ✅ {table}: {len(rows)} rows inserted!")
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  ❌ {table} error: {err}")

print("\n🚀 Starting import to Supabase...\n")
upsert("categories", data.get("categories") or [])
upsert("products", data.get("products") or [])
upsert("auth_users", data.get("auth_users") or [])
upsert("otp_requests", data.get("otp_requests") or [])
print("\n🎉 Import complete! Check your Supabase dashboard.\n")
