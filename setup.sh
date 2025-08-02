#!/bin/bash

# Install dependencies
npm install

# Build shared libraries first
nx build shared-theme
nx build shared-types
nx build shared-utils
nx build shared-ui

echo "Setup complete! You can now run:"
echo "npm run serve:user    # User portal on http://localhost:3000"
echo "npm run serve:admin   # Admin portal on http://localhost:3001"