.PHONY: setup
setup:
	npm install --prefix ../backend
	npm install --prefix ../admin
	npm run build --prefix ../admin
	npm run start --prefix ../backend
	npm install --prefix mobile

.PHONY: ci
ci:
	npm run lint
	npm run check-format
	npm run typecheck
	npm run test
	npm ci
