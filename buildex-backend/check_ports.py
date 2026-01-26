import socket

def check_bind(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(('127.0.0.1', port))
        s.listen(1)
        print(f"Port {port}: SUCCESS - Can bind")
        s.close()
        return True
    except PermissionError:
        print(f"Port {port}: FAILED - Permission Denied")
        return False
    except OSError as e:
        print(f"Port {port}: FAILED - {e}")
        return False

ports = [5000, 8080, 8081, 8888, 9090, 3000, 4000]
print("Checking ports...")
results = {p: check_bind(p) for p in ports}
