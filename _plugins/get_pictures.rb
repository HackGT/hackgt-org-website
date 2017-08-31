require "open-uri"
require "smartcropper"
require 'csv'

PLACEHOLDER = "https://unsplash.it/300/?random"

module Jekyll
  class CsvConverter < Converter
    safe true
    priority :low

    @@template = Liquid::Template.parse(File.read('./_plugins/user.liquid'))

    def matches(ext)
      ext =~ /^\.csv$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)

        people_per_row = 3
        counter = 1
        html_formatted = ''
        parsed = CSV.parse(content, :headers => true).map(&:to_hash)
        parsed.each do |member|
            if counter % people_per_row == 0
                html_formatted += DIV_ROW
            end
            templated = @@template.render(member)
            html_formatted += USERBLOCK % templated
            if counter % people_per_row == 2
                html_formatted += DIV_END
            end
            counter += 1
        end
        html_formatted
    end
  end
  USERBLOCK = '<div class="col col-lg-4 col-md-4 col-sm-12">%s</div>'
  DIV_ROW = '<div class="row">'
  DIV_END = '</div>'
end