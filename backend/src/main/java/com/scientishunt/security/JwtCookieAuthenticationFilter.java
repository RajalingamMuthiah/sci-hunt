package com.scientishunt.security;

import java.io.IOException;
import java.util.Optional;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtCookieAuthenticationFilter extends OncePerRequestFilter {

    private final CookieService cookieService;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtCookieAuthenticationFilter(
            CookieService cookieService,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {
        this.cookieService = cookieService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<String> tokenOpt = cookieService.readAccessToken(request);
            if (tokenOpt.isPresent()) {
                Optional<Claims> claimsOpt = jwtService.parseOfType(tokenOpt.get(), "access");
                if (claimsOpt.isPresent()) {
                    Claims claims = claimsOpt.get();
                    String userId = claims.getSubject();
                    try {
                        UserDetails userDetails = userDetailsService.loadByUserId(userId);
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    } catch (Exception ignored) {
                        SecurityContextHolder.clearContext();
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
