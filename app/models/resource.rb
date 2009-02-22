class Resource < ActiveRecord::Base

  class << self 
    attr_accessor :size 
  end  # class instance variable
  
  belongs_to :resourcesable, :polymorphic => true
  
  acts_as_taggable_on :tags
  
  # http://blog.philburrows.com/articles/2008/05/03/hacking-attachment_fu-to-cut-down-on-image-size-while-keeping-things-pretty/
  has_attachment :storage => :file_system,
  :max_size => 20.megabytes,
#  :keep_profile => true, # taken out to potentially save space
  :thumbnails => { :thumb => "168x168>", :lightview => "400x400>" },
  :resize_to => "1024x1024>", # >" apparently means to prevent distorted resizing
  :processor => :rmagick  # :ImageScience, but :rmagick ... weird
  
  #validates_as_attachment
  #validates_uniqueness_of :filename

  def update_thumbnail
    return if parent_id || (!pdf? && !image?)
    puts "######## updating thumbanails for #{filename}"
    temp_file = create_temp_file
    attachment_options[:thumbnails].each { |suffix, size|
      create_or_update_thumbnail( temp_file, suffix, *size )
    }
    sleep 2
  end

  def self.update_thumbnails
    # from http://beast.caboo.se/forums/2/topics/4623
    Resource.all.select{ |r| r.parent_id.nil? && (r.pdf? || r.image?) }.each do |r|
      puts "######## updating thumbanails for #{r.filename}"
      temp_file = r.create_temp_file
      r.attachment_options[:thumbnails].each { |suffix, size|
        r.create_or_update_thumbnail(temp_file, suffix, *size)
      }
      sleep 2
    end
  end
end
