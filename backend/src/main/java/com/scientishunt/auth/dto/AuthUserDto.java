package com.scientishunt.auth.dto;

import com.scientishunt.auth.model.Role;

public record AuthUserDto(String id,String name,String email,Role role,boolean mfaEnabled){}
