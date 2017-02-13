require "open-uri"

Jekyll::Hooks.register :site, :after_init do |get_pictures|
    FileUtils.rm_rf(Dir.glob('./static/images/members/*'))
    CSV.foreach("./_data/members.csv") do |row|
        if row[4] == 'image'
            next
        end
        if row[4] == nil or row[4].include? 'linkedin'
            row[4] = "https://placeholdit.imgix.net/~text?txtsize=28&txt=300%C3%97300&w=300&h=300"
        end
        puts row[4]
        open(row[4]) {|f|
           File.open("./static/images/members/" + row[1] + ".jpg","wb") do |file|
             file.puts f.read
           end
        }
    end
end
