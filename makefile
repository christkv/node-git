
NODE = node

test:
	@$(NODE) test/all_tests.js
		
.PHONY: test