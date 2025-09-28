FRONTEND_DIR = liff-frontend
BACKEND_DIR = src
TREE_FILE = project_tree.txt

.PHONY: help
help:
	@echo "可用指令："
	@echo "  make dev-frontend   - 啟動前端 (vite)"
	@echo "  make build-frontend - 建置前端"
	@echo "  make dev-backend    - 啟動後端 (node)"
	@echo "  make tree           - 產生專案目錄結構到 $(TREE_FILE)"

.PHONY: dev-frontend
dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: build-frontend
build-frontend:
	cd $(FRONTEND_DIR) && npm run build

.PHONY: dev-backend
dev-backend:
	node $(BACKEND_DIR)/index.js

.PHONY: tree
tree:
	@echo "專案目錄結構已輸出到 $(TREE_FILE)"
	@tree -I "node_modules|.git|dist|.venv|.DS_Store" > $(TREE_FILE)
