#!/usr/bin/env python3

import subprocess
import sys

def run_command(command):
    """Run a shell command and return the output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result.stdout

def block_access():
    """Block access to api.axiom.co on port 443."""
    print("Blocking access to api.axiom.co on port 443...")
    run_command("sudo iptables -A OUTPUT -p tcp -d api.axiom.co --dport 443 -j REJECT")
    print("Access blocked.")

def unblock_access():
    """Unblock access to api.axiom.co on port 443."""
    print("Unblocking access to api.axiom.co on port 443...")
    run_command("sudo iptables -D OUTPUT -p tcp -d api.axiom.co --dport 443 -j REJECT")
    print("Access unblocked.")

def test_connection():
    """Test connection to api.axiom.co."""
    print("Testing connection to api.axiom.co...")
    result = run_command("nc -zv api.axiom.co 443 2>&1")
    if "succeeded" in result:
        print("Connection successful.")
    else:
        print("Connection failed.")

def main():
    try:
        while True:
            print("\nOptions:")
            print("1. Block access")
            print("2. Unblock access")
            print("3. Test connection")
            print("4. Exit")
            choice = input("Enter your choice: ")

            if choice == '1':
                block_access()
            elif choice == '2':
                unblock_access()
            elif choice == '3':
                test_connection()
            elif choice == '4':
                unblock_access()
                print("Exiting and cleaning up...")
                sys.exit(0)
            else:
                print("Invalid choice. Please try again.")
    except KeyboardInterrupt:
        unblock_access()
        print("\nExiting and cleaning up...")

if __name__ == "__main__":
    main()