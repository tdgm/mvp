$(document).ready(function() {
  
  /* $(document).scroll(function() {
    var scrollTop = $(this).scrollTop();

    if (scrollTop > 0) {
      $("#sticky").addClass("active");
    } else {
      $("#sticky").removeClass("active");
    }
  }); */
  
  $.currentYear();  
      
});

$.currentYear = function() {
  
  var date = new Date(),
      currentYear = date.getFullYear(),
      html = '<span class="powered">&copy; Copyright '+ currentYear +', CHEFF JÁ - Todos os direitos reservados.</span>';

  $('.powered').html(html); 

}