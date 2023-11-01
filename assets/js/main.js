document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('avatar');
    let currentPosition = 0;
    let direction = 1;
    const maxPosition = 20;
    const speed = 0.1; 
  
    function animateAvatar() {
      currentPosition += direction * speed;
      
      if (currentPosition >= maxPosition || currentPosition <= 0) {
        direction *= -1;
      }
      
      avatar.style.transform = `translateX(${currentPosition}px)`;
      requestAnimationFrame(animateAvatar);
    }
  
    animateAvatar();
  });
 