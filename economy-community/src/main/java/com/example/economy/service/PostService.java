package com.example.economy.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import com.example.economy.dto.PostDTO;
import com.example.economy.entity.Post;
import com.example.economy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;


@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

    @CacheEvict(value = { "allPosts", "authorPosts" }, allEntries = true)
    public Post createPost(PostDTO dto) {
        identityClient.getUserById(dto.getAuthorId());

        Post post = new Post();
        post.setAuthorId(dto.getAuthorId());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postRepository.save(post);

        metricsService.incrementActiveUsers();
        logService.log("INFO", "Post created: " + dto.getTitle() + " by user " + dto.getAuthorId());

        return post;
    }

    @Cacheable(value = "allPosts")
    public Page<Post> getAllPosts(
        int page,
        int size
    ) {
        PageRequest pageable = PageRequest.of(page, size);
        
        return postRepository.findAll(pageable);
    }

    @Cacheable(value = "posts", key = "#id")
    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Cacheable(value = "authorPosts", key = "#authorId")
    public List<Post> getAuthorPosts(String authorId) {
        return postRepository.findByAuthorId(authorId);
    }

    @CachePut(value = "posts", key = "#id")
    @CacheEvict(value = { "allPosts", "authorPosts" }, allEntries = true)
    public Post updatePost(String id, PostDTO dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (dto.getTitle() != null) {
            post.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            post.setContent(dto.getContent());
        }
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        logService.log("INFO", "Post updated: " + id);
        return post;
    }

    @CachePut(value = "posts", key = "#id")
    public Post likePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        logService.log("INFO", "Post liked: " + id);
        return post;
    }

    @CacheEvict(value = { "posts", "allPosts", "authorPosts" }, key = "#id", allEntries = true)
    public void deletePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        postRepository.delete(post);
        logService.log("INFO", "Post deleted: " + id);
    }
}
