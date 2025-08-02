# Create Nx workspace
npx create-nx-workspace@latest healthcare-assessment --preset=react-monorepo --packageManager=npm

cd healthcare-assessment

# Add Next.js plugin
npm install --save-dev @nx/next

# Generate Next.js apps
nx g @nx/next:app user-portal --style=css --appDir=true
nx g @nx/next:app admin-portal --style=css --appDir=true

# Add shared libraries
nx g @nx/react:lib shared-ui --style=css --bundler=vite
nx g @nx/react:lib shared-theme --style=css --bundler=vite
nx g @nx/react:lib shared-utils --style=css --bundler=vite
nx g @nx/react:lib shared-types --style=css --bundler=vite

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install tailwindcss postcss autoprefixer @tailwindcss/typography
npm install @types/react @types/react-dom typescript