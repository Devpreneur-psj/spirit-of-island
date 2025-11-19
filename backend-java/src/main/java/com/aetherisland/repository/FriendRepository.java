package com.aetherisland.repository;

import com.aetherisland.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, String> {
    List<Friend> findByUserIdAndStatus(String userId, String status);
    
    List<Friend> findByFriendIdAndStatus(String friendId, String status);
    
    @Query("SELECT f FROM Friend f WHERE (f.userId = :userId AND f.friendId = :friendId) OR (f.userId = :friendId AND f.friendId = :userId)")
    Optional<Friend> findFriendRelationship(@Param("userId") String userId, @Param("friendId") String friendId);
    
    @Query("SELECT f FROM Friend f WHERE f.friendId = :userId AND f.status = 'pending'")
    List<Friend> findPendingRequestsByFriendId(@Param("userId") String userId);
}

