# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  include TagsHelper
  
  FLASH_NOTICE_KEYS = [:error, :notice, :warning]

  def flash_messages
    return unless messages = flash.keys.select{|k| FLASH_NOTICE_KEYS.include?(k)}
    formatted_messages = messages.map do |type|      
      content_tag :div, :id => 'flash', :class => type.to_s do
        message_for_item(flash[type], flash["#{type}_item".to_sym])
      end
    end
    formatted_messages.join
  end

  def message_for_item(message, item = nil)
    if item.is_a?(Array)
      message % link_to(*item)
    else
      message % item
    end
  end

	def if_admin?
    yield if logged_in? && current_user.has_role?('admin')
	end

	def if_logged_in?
		yield if logged_in?
	end

	def if_recaptcha?
		yield if false and @bad_visitor
	end

	def in_beta?
		APP_CONFIG['settings']['in_beta']
	end

	def if_in_beta?
		yield if in_beta?
	end

	def unless_in_beta?
		yield unless in_beta?
	end

	def if_invites_available?
		yield if in_beta? and logged_in? and (current_user.invitation_limit > 0)
	end

	def focus_on_div(div)
	  update_page do |page|
	    page[div].focus
	  end
	end

    def filter_tag_list_unless(value, tag_list)
      if value
        return tag_list
      else
        return tag_list.reject{|tag| tag.first =='*'}
      end
    end

    def filter_tags_unless(value, tags_array)
      if value
        return tags_array
      else
        return tags_array.reject{ |tag| tag.name.first == '*' }
      end
    end
end
