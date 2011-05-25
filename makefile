
NODE = node
NODEUNIT = nodeunit

test:
	@$(NODEUNIT) test/

.PHONY: test