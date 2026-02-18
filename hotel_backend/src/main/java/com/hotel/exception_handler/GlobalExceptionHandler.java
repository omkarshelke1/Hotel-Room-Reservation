package com.hotel.exception_handler;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> resp = new HashMap<>();
        resp.put("error", ex.getMessage());
        resp.put("status", "NOT_FOUND");
        return new ResponseEntity<>(resp, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(com.hotel.custom_exceptions.RoomNotAvailableException.class)
    public ResponseEntity<Map<String, String>> handleRoomNotAvailable(
            com.hotel.custom_exceptions.RoomNotAvailableException ex) {
        Map<String, String> resp = new HashMap<>();
        resp.put("error", ex.getMessage());
        resp.put("status", "CONFLICT");
        return new ResponseEntity<>(resp, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> resp = new HashMap<>();
        resp.put("error", ex.getMessage());
        resp.put("status", "BAD_REQUEST");
        return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
    }
}