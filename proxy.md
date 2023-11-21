export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890


git config --global http.https://github.com.proxy socks5://127.0.0.1:7890
git config --global https.https://github.com.proxy socks5://127.0.0.1:7890
