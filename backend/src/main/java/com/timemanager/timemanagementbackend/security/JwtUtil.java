package com.timemanager.timemanagementbackend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key eka - production ekedi environment variable ekakin ganna one
    private final SecretKey secretKey = Keys.hmacShaKeyFor(
            "ThisIsASecretKeyForJWTTokenGenerationMakeItLongEnough".getBytes()
    );

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    // Token eka generate karanawa
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    // Token eken email eka ganna
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Token eka valid da kiyala check karanawa
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}