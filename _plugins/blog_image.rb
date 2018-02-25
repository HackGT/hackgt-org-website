module Jekyll
  class RenderBlogImage < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
    	params = @text.split('|')
    	"<div class='post-image'>
    	<img src='/assets/blog/#{params[0]}'/>
    	<p class='caption'>#{params[1]}</p></div>"
    end
  end
end

Liquid::Template.register_tag('render_image', Jekyll::RenderBlogImage)