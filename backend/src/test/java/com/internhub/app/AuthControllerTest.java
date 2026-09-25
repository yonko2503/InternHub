package com.internhub.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internhub.app.dto.AuthRequest;
import com.internhub.app.dto.RegisterRequest;
import com.internhub.app.model.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("TC-01: Đăng nhập thành công với tài khoản Admin mẫu")
    void testLoginSuccess() throws Exception {
        AuthRequest loginRequest = new AuthRequest("admin", "admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("TC-02: Đăng nhập thất bại khi sai mật khẩu")
    void testLoginWrongPassword() throws Exception {
        AuthRequest loginRequest = new AuthRequest("admin", "wrong_password_999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-03: Đăng ký tài khoản sinh viên mới thành công")
    void testRegisterStudentSuccess() throws Exception {
        String uniqueUser = "sv_test_" + System.currentTimeMillis();
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username(uniqueUser)
                .email(uniqueUser + "@vnu.edu.vn")
                .password("Pass@123456")
                .fullName("Sinh Viên Kiểm Thử")
                .role(Role.ROLE_STUDENT)
                .phone("0987654321")
                .studentCode("23020000")
                .university("Đại học Công nghệ - ĐHQGHN")
                .major("Công nghệ Thông tin")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value(uniqueUser))
                .andExpect(jsonPath("$.data.role").value("ROLE_STUDENT"));
    }
}
