package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileServiceImpl implements FileService{
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file, String folder) throws IOException  {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("You selected an empty file!");
        }

        Path folderPath = Paths.get(uploadDir, folder);

        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        String fileName = UUID.randomUUID()
                + getFileExtension(file.getOriginalFilename());

        Path filePath = folderPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + folder + "/" + fileName;
    }

    @Override
    public void deleteFile(String filePath) {

    }
    private String getFileExtension(String filename) {
        if (filename == null) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

}
