import socket
import sys
from pathlib import Path
from datetime import datetime
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend

def convert_int_to_bytes(x):
    return x.to_bytes(8, "big")

def convert_bytes_to_int(xbytes):
    return int.from_bytes(xbytes, "big")

def authenticate_server(client_socket):
    print("Starting authentication...")

    # Send MODE 3
    client_socket.send(convert_int_to_bytes(3))

    # Send arbitrary message
    message = b'This is the authentication message'
    client_socket.send(convert_int_to_bytes(len(message)))
    client_socket.send(message)
    print(f"Sent authentication message: {message}")

    # Receive signed message size
    m1_size = convert_bytes_to_int(client_socket.recv(8))
    print(f"Received signed message size: {m1_size}")
    
    # Receive signed message
    signed_message = client_socket.recv(m1_size)
    print(f"Received signed message: {signed_message}")

    # Receive server certificate size
    m1_size = convert_bytes_to_int(client_socket.recv(8))
    print(f"Received server certificate size: {m1_size}")
    
    # Receive server certificate
    server_cert_data = client_socket.recv(m1_size)
    print(f"Received server certificate: {server_cert_data}")

    # Verify server certificate
    with open('source/auth/cacsertificate.crt', 'rb') as f:
        ca_cert = load_pem_x509_certificate(f.read(), default_backend())
    ca_public_key = ca_cert.public_key()

    server_cert = load_pem_x509_certificate(server_cert_data, default_backend())
    ca_public_key.verify(
        server_cert.signature,
        server_cert.tbs_certificate_bytes,
        padding.PKCS1v15(),
        server_cert.signature_hash_algorithm
    )
    print("Server certificate verified.")

    # Verify signed message
    server_public_key = server_cert.public_key()
    server_public_key.verify(
        signed_message,
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    print("Signed message verified. Authentication successful.")

def main():
    port = 4321
    server_address = "localhost"

    # Establish connection to server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((server_address, port))
        print("Connected")

        # Authenticate the server
        authenticate_server(s)

        # Display current date and time once
        current_time = datetime.now()
        print(current_time)

        while True:
            filename = input("Enter a filename to send (enter -1 to exit):").strip()

            while filename != "-1" and (not Path(filename).is_file()):
                filename = input("Invalid filename. Please try again:").strip()

            if filename == "-1":
                s.sendall(convert_int_to_bytes(2))
                break

            filename_bytes = bytes(filename, encoding="utf8")

            # Send the filename
            s.sendall(convert_int_to_bytes(0))
            s.sendall(convert_int_to_bytes(len(filename_bytes)))
            s.sendall(filename_bytes)
            print(f"Sent filename: {filename}")

            # Send the file
            with open(filename, mode="rb") as fp:
                data = fp.read()
                s.sendall(convert_int_to_bytes(1))
                s.sendall(convert_int_to_bytes(len(data)))
                s.sendall(data)
                print(f"Finished sending file {filename}")

        # Close the connection
        s.sendall(convert_int_to_bytes(2))
        print("Closing connection...")

if __name__ == "__main__":
    main()
