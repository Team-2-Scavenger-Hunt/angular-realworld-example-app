import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../../../types";
import { profileService } from "../services/profile.service";
import { useAuth } from "../../../core/auth/useAuth";

interface FollowButtonProps {
  profile: Profile;
}

const FollowButton: React.FC<FollowButtonProps> = ({ profile }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () =>
      profile.following
        ? profileService.unfollowUser(profile.username)
        : profileService.followUser(profile.username),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", profile.username],
      });
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) return;
    followMutation.mutate();
  };

  return (
    <button
      className={`btn btn-sm ${
        profile.following ? "btn-secondary" : "btn-outline-secondary"
      }`}
      onClick={handleClick}
      disabled={followMutation.isPending}
    >
      <i className="ion-plus-round"></i>
      &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
};

export default FollowButton;
