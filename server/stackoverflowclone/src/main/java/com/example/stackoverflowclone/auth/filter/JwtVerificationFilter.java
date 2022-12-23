package com.example.stackoverflowclone.auth.filter;

import com.example.stackoverflowclone.auth.jwt.JwtTokenizer;
import com.example.stackoverflowclone.auth.utils.CustomAuthorityUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {
    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;

    public JwtVerificationFilter(JwtTokenizer jwtTokenizer, CustomAuthorityUtils authorityUtils) {
        this.jwtTokenizer = jwtTokenizer;
        this.authorityUtils = authorityUtils;
    }

    /*
     * 필터 추가, JWT 객체를 꺼내서 SecurityContext에 저장함
     * */

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 예외처리 추가
        try{
            Map<String,Object> claims = verifyJws(request);
            setAuthenticationToContext(claims);
        } catch (SignatureException se){
            request.setAttribute("exception",se);
        } catch (ExpiredJwtException ex){
            request.setAttribute("exception",ex);
        } catch (Exception e){
            request.setAttribute("exception",e);
        }

        // 다음 Filter 실행
        filterChain.doFilter(request,response);
    }

    /*
     * 만약 request에 전달받은 authorization이 없으면 해당 필터는 실행안함
     * */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String authorization = request.getHeader("Authorization");
        return authorization == null || !authorization.startsWith("Bearer");
    }

    /*
     * request 객체로 claims 객체 꺼내는 메서드
     * */
    private Map<String,Object> verifyJws(HttpServletRequest request){
        String jws = request.getHeader("Authorization").replace("Bearer ","");
        log.info("-----------> 토큰정보 : "+ jws);
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());
        Map<String ,Object> claims = jwtTokenizer.getClaims(jws, base64EncodedSecretKey).getBody();
        return claims;
    }

    /*
     * SecurityContext에 저장하는 부분
     * */
    private void setAuthenticationToContext(Map<String, Object> claims){
        String username = (String) claims.get("username");

        List<GrantedAuthority> authorities = authorityUtils.createAuthorities((List)claims.get("roles"));

        for(GrantedAuthority s : authorities){
            System.out.println("-----------> 유저 권한정보 : " +s.getAuthority());
        }


        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
