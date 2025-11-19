package com.aetherisland.repository;

import com.aetherisland.entity.UserItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserItemRepository extends JpaRepository<UserItem, String> {
    List<UserItem> findByUserId(String userId);
    Optional<UserItem> findByUserIdAndItemId(String userId, String itemId);
}

