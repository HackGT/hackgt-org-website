require "open-uri"		
require "csv"

SRC_PATH = File.expand_path(File.dirname(__FILE__))
CSV_FILE = "_data/members.csv"
PATH_TO_CSV = File.join SRC_PATH, CSV_FILE
STATIC_DIR = "static/images/members/"
WRITE_PATH = File.join SRC_PATH, STATIC_DIR 

PLACEHOLDER = "https://unsplash.it/300/?random"		

def download_and_save(name, url)
	open(url) { |f|
		file_path = File.join(WRITE_PATH, name)
		File.open(file_path, "wb") do |file|
			file.puts f.read
		end
	}
rescue
	open(PLACEHOLDER) { |f|
		file_path = File.join(WRITE_PATH, name)
		File.open(file_path, "wb") do |file|
			file.puts f.read
		end			
	}
end

parsed = CSV.parse(File.open(CSV_FILE))

parsed.each do |member|
	name = member[1]
	image_url = member[4]
	if name != 'name'
		download_and_save(name, image_url)
	end  

end
