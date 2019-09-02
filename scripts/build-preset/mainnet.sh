#!/bin/sh

PUBLIC_URL="" \
REACT_APP_SERVER_HOST="https://explorer.codechain.io" \
REACT_APP_URL="https://explorer.codechain.io" \
REACT_APP_HEADER_TITLE="CodeChain Explorer" \
REACT_APP_HEADER_SHORT_TITLE="Explorer" \
REACT_APP_OG_TITLE="CodeChain Explorer" \
REACT_APP_OG_DESC="View activity on the underlying CodeChain network" \
REACT_APP_OG_IMAGE="og_image.png" \
yarn build
