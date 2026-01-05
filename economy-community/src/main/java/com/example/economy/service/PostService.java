package com.example.economy.service;

import com.example.economy.dto.PostDTO;
import com.example.economy.entity.Post;
import com.example.economy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final IdentityClient identityClient;
    private final LogService logService;
    private final MetricsService metricsService;

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

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public List<Post> getAuthorPosts(String authorId) {
        return postRepository.findByAuthorId(authorId);
    }

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

    public Post likePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        logService.log("INFO", "Post liked: " + id);
        return post;
    }

    public void deletePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        postRepository.delete(post);
        logService.log("INFO", "Post deleted: " + id);
    }
}
