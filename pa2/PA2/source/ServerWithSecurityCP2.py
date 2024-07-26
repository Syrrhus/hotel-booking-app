# ServerWithSecurityCP2.py
import socket
import sys
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet

# Function to load private key
def load_private_key(filepath):
    with open(filepath, "rb") as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )

# Load server's private key
server_private_key = load_private_key("source/auth/server_private_key.pem")

def convert_int_to_bytes(x):
    return x.to_bytes(8, "big")

def convert_bytes_to_int(xbytes):
    return int.from_bytes(xbytes, "big")

def read_bytes(socket, length):
    buffer = []
    bytes_received = 0
    while bytes_received < length:
        data = socket.recv(min(length - bytes_received, 1024))
        if not data:
            raise Exception("Socket connection broken")
        buffer.append(data)
        bytes_received += len(data)
    return b"".join(buffer)

def main(args):
    port = int(args[0]) if len(args) > 0 else 4321
    address = args[1] if len(args) > 1 else "localhost"

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((address, port))
            s.listen()

            client_socket, client_address = s.accept()
            with client_socket:
                while True:
                    packet_type = convert_bytes_to_int(read_bytes(client_socket, 8))
                    if packet_type == 4:
                        # Receive and decrypt the session key
                        encrypted_session_key_len = convert_bytes_to_int(read_bytes(client_socket, 8))
                        encrypted_session_key = read_bytes(client_socket, encrypted_session_key_len)

                        session_key = server_private_key.decrypt(
                            encrypted_session_key,
                            padding.OAEP(
                                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                                algorithm=hashes.SHA256(),
                                label=None
                            )
                        )

                        fernet = Fernet(session_key)
                        print(f"Session key decrypted. Key: {session_key.decode()}")

                    elif packet_type == 0:
                        # Receiving filename
                        filename_len = convert_bytes_to_int(read_bytes(client_socket, 8))
                        filename = read_bytes(client_socket, filename_len).decode("utf-8")
                    elif packet_type == 1:
                        # Receiving encrypted file data
                        file_len = convert_bytes_to_int(read_bytes(client_socket, 8))
                        encrypted_file_data = read_bytes(client_socket, file_len)

                        # Decrypt the data
                        fernet = Fernet(session_key)
                        
                        file_data = fernet.decrypt(encrypted_file_data)
                        print(f"File data decrypted. Length of decrypted file data: {len(file_data)}")

                        filename = "recv_" + Path(filename).name
                        with open(f"recv_files/{filename}", "wb") as fp:
                            fp.write(file_data)
                        print(f"Finished receiving file: {filename}")

                    elif packet_type == 2:
                        # Close the connection
                        print("Closing connection...")
                        break

    except Exception as e:
        print(e)

if __name__ == "__main__":
    main(sys.argv[1:])
