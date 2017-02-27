require "open-uri"
require "smartcropper"

PLACEHOLDER = "https://unsplash.it/300/?random"

Jekyll::Hooks.register :site, :after_init do |get_pictures|
    FileUtils.rm_rf(Dir.glob('./static/images/members/*'))
    CSV.foreach("./_data/members.csv") do |row|
        if row[4] == 'image'
            next
        end
        if row[4] == nil or row[4].include? 'linkedin'
            row[4] = PLACEHOLDER
        end
        puts row[4]
        open(PLACEHOLDER) {|f|
            name = "./static/images/members/" + row[1]
            File.open(name,"wb") do |file|
                file.puts f.read
            end
            SmartCropper.from_file(name).smart_square.write(name)
        }
    end
    CSV.foreach("./_data/exec.csv") do |row|
        if row[4] == 'image'
            next
        end
        if row[4] == nil or row[4].include? 'linkedin'
            row[4] = PLACEHOLDER
        end
        puts row[4]
        open(PLACEHOLDER) {|f|
            name = "./static/images/members/" + row[1]
            File.open(name,"wb") do |file|
                file.puts f.read
            end
            SmartCropper.from_file(name).smart_square.write(name)
        }
    end
end
