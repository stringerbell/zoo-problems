deploy:
	npx vite build
	npx gh-pages -d dist
