package com.example.testdemo.mycontroller;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.unit.DataSize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.MultipartConfigElement;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping
public class Mycontroller {
    @GetMapping("/hello")
    public String hello(){
        return "<h1>This is a Hello page</h1>";
    }
    @GetMapping("/home")
    public String home(){
        return "<h1>This is a Home page</h1>";
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
	  /// single file maximum
        factory.setMaxFileSize(DataSize.parse("100MB"));
        /// Set the total size of the total upload data
        factory.setMaxRequestSize(DataSize.parse("100MB"));
        return factory.createMultipartConfig();
    }





    @CrossOrigin
    @PostMapping(value ="/csvtojson", consumes = "multipart/form-data")
    public ResponseEntity<Object> csvtojson(@RequestParam("file") MultipartFile file)throws Exception{
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        if(!file.isEmpty()) {
            File input = multipartToFile(file,file.getOriginalFilename());
            List<Map<?, ?>> data = readObjectsFromCsv(input);
            return new ResponseEntity<Object>(data, HttpStatus.OK);
        }
        return ResponseEntity.ok("");
    }


    public static List<Map<?, ?>> readObjectsFromCsv(File file) throws IOException {
        CsvSchema bootstrap = CsvSchema.emptySchema().withHeader();
        CsvMapper csvMapper = new CsvMapper();
        MappingIterator<Map<?, ?>> mappingIterator = csvMapper.reader(Map.class).with(bootstrap).readValues(file);

        return mappingIterator.readAll();
    }

    public  static File multipartToFile(MultipartFile multipart, String fileName) throws IllegalStateException, IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir")+"/"+fileName);
        multipart.transferTo(convFile);
        return convFile;
    }




}
