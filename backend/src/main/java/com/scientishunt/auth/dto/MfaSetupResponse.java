package com.scientishunt.auth.dto;

public record MfaSetupResponse(String secret,String otpAuthUri){}
