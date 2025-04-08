generate:
	# tacacs yaml
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v7.1.0 generate -i /local/resources/tacacs-api.yaml -g typescript-axios -o /local/src/generated/tacacs --additional-properties=\"supportsES6=true\"
	# cmanager
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v7.1.0 generate -i /local/resources/cmanager.yaml -g typescript-axios -o /local/src/generated/cmanager --additional-properties=\"supportsES6=true\"
	# authws
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v7.1.0 generate -i /local/resources/auth-api.yaml -g typescript-axios -o /local/src/generated/authws --additional-properties=\"supportsES6=true\"
	# terminal
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v7.1.0 generate -i /local/resources/terminal-api.yaml -g typescript-axios -o /local/src/generated/terminal --additional-properties=\"supportsES6=true\"
	# replace some rules
	find src/generated -type f -name "*.ts" -exec sed -i '' 's/RawAxiosRequestConfig/AxiosRequestConfig/g' {} \;
	find src/generated -type f -name "*.ts" -exec sed -i '' 's/axios.request<T, R>/axios.request<T>/g' {} \;

local:
	docker build -f Dockerfile.dev -t pdavui:dev .
	docker run --rm -it -p 8080:8080 --name pdavui pdavui:dev