package com.internhub.app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .servers(List.of(
                        new Server().url("/").description("Current Server (Auto HTTP/HTTPS Relative Path)")
                ))
                .info(new Info()
                        .title("InternHub UET - RESTful API Documentation")
                        .version("1.0.0")
                        .description("Hệ thống quản lý tuyển dụng và thực tập sinh UET - Trường Đại học Công nghệ, ĐHQGHN.\n\n"
                                + "Tác giả: 23021642 (23021642@vnu.edu.vn)\n"
                                + "Bao gồm đầy đủ các API: Xác thực (JWT), Quản lý việc làm, Ứng tuyển & CV, Lịch phỏng vấn, Quản trị Admin.\n\n"
                                + "👉 **Hướng dẫn test trên Swagger**:\n"
                                + "1. Gọi API `POST /api/auth/login` (có sẵn mẫu tài khoản `admin` / `admin123` hoặc `viettel_solutions` / `123456`) để lấy `accessToken`.\n"
                                + "2. Bấm nút **Authorize (ổ khóa)** ở góc trên bên phải, dán chuỗi token vào ô Value và bấm **Authorize**.\n"
                                + "3. Bấm **Try it out** và **Execute** tại bất kỳ API nào để xem kết quả thực tế!")
                        .contact(new Contact()
                                .name("Nguyễn Lê Hải Nam - 23021642")
                                .email("23021642@vnu.edu.vn")
                                .url("https://github.com/yonko2503/InternHub"))
                        .license(new License().name("MIT License").url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Dán chuỗi accessToken vào đây (không cần nhập thêm chữ 'Bearer ')")));
    }
}
