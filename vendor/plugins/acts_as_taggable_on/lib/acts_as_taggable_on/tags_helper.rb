module TagsHelper
  # modified by perry on 19 Feb 2009 to have sorting by multiple fields
  # and in reverse order
  # See the README for an example using tag_cloud.
  def tag_cloud(tags, classes)
    #sorted_tags = tags.sort_by{ |s| [s.count, s.name.length, s.name] }.reverse
    sorted_tags = tags.sort_by{ |s| s.name.downcase }
    max_count = tags.sort_by(&:count).last.count.to_f
    
    sorted_tags.each do |tag|
      index = ((tag.count / max_count) * (classes.size - 1)).round
      yield tag, classes[index]
    end
  end
end
