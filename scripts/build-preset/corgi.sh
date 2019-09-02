#!/bin/sh

PUBLIC_URL="/explorer" \
REACT_APP_SERVER_HOST="https://corgi.codechain.io/explorer" \
REACT_APP_URL="https://corgi.codechain.io/explorer" \
REACT_APP_HEADER_TITLE="CodeChain Explorer - Corgi" \
REACT_APP_HEADER_SHORT_TITLE="Explorer - Corgi" \
REACT_APP_OG_TITLE="CodeChain Explorer For Corgi" \
REACT_APP_OG_DESC="View activity on the underlying Corgi test network" \
REACT_APP_OG_IMAGE="og_image_corgi.png" \
yarn build
