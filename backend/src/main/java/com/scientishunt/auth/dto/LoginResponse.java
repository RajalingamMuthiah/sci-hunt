package com.scientishunt.auth.dto;

public class LoginResponse {

    private boolean mfaRequired;
    private String challengeToken;
    private AuthUserDto user;

    public static LoginResponse mfaRequired(String challengeToken) {
        LoginResponse response = new LoginResponse();
        response.mfaRequired = true;
        response.challengeToken = challengeToken;
        return response;
    }

    public static LoginResponse success(AuthUserDto user) {
        LoginResponse response = new LoginResponse();
        response.mfaRequired = false;
        response.user = user;
        return response;
    }

    public boolean isMfaRequired() {
        return mfaRequired;
    }

    public String getChallengeToken() {
        return challengeToken;
    }

    public AuthUserDto getUser() {
        return user;
    }
}
