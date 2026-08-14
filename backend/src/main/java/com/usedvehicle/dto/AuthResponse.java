package com.usedvehicle.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public UserResponse getUser() { return user; }
}
