package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
     String uploadFile(MultipartFile file, String folder)throws IOException;
     void deleteFile(String filePath);
}
