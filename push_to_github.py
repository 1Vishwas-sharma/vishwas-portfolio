"""
GitHub Publisher for Vishwa Sharma Portfolio
Pushes all portfolio files to GitHub via GitHub REST API.
"""

import os
import sys
import json
import base64
import urllib.request
import urllib.error

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
FILES_TO_PUSH = ["index.html", "styles.css", "script.js", "README.md", ".gitignore"]

def make_request(url, method="GET", data=None, token=None):
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Vishwa-Portfolio-Deployer"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8")), resp.status
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        return {"error": err_msg, "status": e.code}, e.code

def push_portfolio(token, repo_name="vishwa-portfolio", is_private=False):
    print(f"[*] Validating GitHub authentication token...")
    user_data, status = make_request("https://api.github.com/user", token=token)
    if status != 200:
        print(f"[!] Authentication failed: {user_data}")
        return False

    username = user_data["login"]
    print(f"[✓] Signed in as: @{username}")

    # Check if repository exists or create it
    repo_url = f"https://api.github.com/repos/{username}/{repo_name}"
    repo_info, r_status = make_request(repo_url, token=token)

    if r_status == 404:
        print(f"[*] Creating repository '{repo_name}' on GitHub...")
        create_payload = {
            "name": repo_name,
            "description": "Personal Portfolio & Engineering Showcase | SKIT Jaipur | C++, Java, DSA & Athletics",
            "private": is_private,
            "auto_init": False
        }
        repo_info, c_status = make_request("https://api.github.com/user/repos", method="POST", data=create_payload, token=token)
        if c_status not in (200, 201):
            print(f"[!] Failed to create repo: {repo_info}")
            return False
        print(f"[✓] Repository created: {repo_info['html_url']}")
    else:
        print(f"[✓] Repository exists: {repo_info['html_url']}")

    # Commit each file
    for filename in FILES_TO_PUSH:
        filepath = os.path.join(PROJECT_DIR, filename)
        if not os.path.exists(filepath):
            continue

        with open(filepath, "rb") as f:
            content_b64 = base64.b64encode(f.read()).decode("utf-8")

        file_api_url = f"https://api.github.com/repos/{username}/{repo_name}/contents/{filename}"
        existing_file, f_status = make_request(file_api_url, token=token)

        payload = {
            "message": f"Deploy {filename}: Vishwa Sharma Portfolio",
            "content": content_b64
        }
        if f_status == 200 and "sha" in existing_file:
            payload["sha"] = existing_file["sha"]

        resp, put_status = make_request(file_api_url, method="PUT", data=payload, token=token)
        if put_status in (200, 201):
            print(f"[✓] Successfully pushed: {filename}")
        else:
            print(f"[!] Failed to push {filename}: {resp}")

    print("\n" + "=" * 50)
    print(f"🎉 SUCCESS! Your portfolio is live on GitHub:")
    print(f"👉 Repo URL: https://github.com/{username}/{repo_name}")
    print("=" * 50)
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        token_arg = sys.argv[1]
        repo_arg = sys.argv[2] if len(sys.argv) > 2 else "vishwa-portfolio"
        push_portfolio(token_arg, repo_arg)
    else:
        print("Usage: python push_to_github.py <GITHUB_TOKEN> [repo_name]")
