# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20090218041038) do

  create_table "collaborations", :force => true do |t|
    t.integer  "collaborator_id"
    t.integer  "product_id"
    t.string   "product_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "collaborators", :force => true do |t|
    t.string   "lastname"
    t.string   "firstname"
    t.string   "uniqname"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "photo_id"
    t.string   "email"
    t.string   "url"
  end

  create_table "courses", :force => true do |t|
    t.string   "dept"
    t.integer  "courseno"
    t.text     "description"
    t.string   "coursename"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "date"
    t.integer  "key_resource_id"
    t.string   "projects_order"
    t.string   "deliverables_order"
    t.string   "resources_order"
    t.integer  "overlay_id"
  end

  create_table "deliverables", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "resources_order"
    t.integer  "key_resource_id"
    t.integer  "overlay_id"
  end

  create_table "four_oh_fours", :force => true do |t|
    t.string   "url"
    t.string   "referer"
    t.integer  "count",      :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "four_oh_fours", ["url", "referer"], :name => "index_four_oh_fours_on_url_and_referer", :unique => true
  add_index "four_oh_fours", ["url"], :name => "index_four_oh_fours_on_url"

  create_table "invitations", :force => true do |t|
    t.integer  "sender_id"
    t.string   "email"
    t.string   "token"
    t.datetime "sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "invitations", ["token"], :name => "index_invitations_on_token", :unique => true

  create_table "logged_exceptions", :force => true do |t|
    t.string   "exception_class"
    t.string   "controller_name"
    t.string   "action_name"
    t.text     "message"
    t.text     "backtrace"
    t.text     "environment"
    t.text     "request"
    t.datetime "created_at"
  end

  create_table "open_id_authentication_associations", :force => true do |t|
    t.integer "issued"
    t.integer "lifetime"
    t.string  "handle"
    t.string  "assoc_type"
    t.binary  "server_url"
    t.binary  "secret"
  end

  create_table "open_id_authentication_nonces", :force => true do |t|
    t.integer "timestamp",  :null => false
    t.string  "server_url"
    t.string  "salt",       :null => false
  end

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "course_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "key_resource_id"
    t.string   "deliverables_order"
    t.string   "resources_order"
    t.integer  "overlay_id"
    t.string   "project_url"
  end

  create_table "resources", :force => true do |t|
    t.integer  "parent_id"
    t.string   "content_type"
    t.string   "filename"
    t.string   "thumbnail"
    t.integer  "size"
    t.integer  "width"
    t.integer  "height"
    t.integer  "resource_owner_id"
    t.string   "resource_owner_type"
    t.string   "alt_text"
    t.string   "url"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "has_slideshare",      :default => false, :null => false
    t.boolean  "is_overlay",          :default => false, :null => false
  end

  create_table "roles", :force => true do |t|
    t.string "name"
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer "role_id"
    t.integer "user_id"
  end

  add_index "roles_users", ["role_id"], :name => "index_roles_users_on_role_id"
  add_index "roles_users", ["user_id"], :name => "index_roles_users_on_user_id"

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "taggable_type"
    t.string   "context"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type", "context"], :name => "index_taggings_on_taggable_id_and_taggable_type_and_context"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "user_failures", :force => true do |t|
    t.string   "remote_ip"
    t.string   "http_user_agent"
    t.string   "failure_type"
    t.string   "username"
    t.integer  "count",           :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_failures", ["remote_ip"], :name => "index_user_failures_on_remote_ip"

  create_table "users", :force => true do |t|
    t.string   "user_type"
    t.string   "login",                     :limit => 40
    t.string   "name",                      :limit => 100, :default => ""
    t.string   "email",                     :limit => 100
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",            :limit => 40
    t.datetime "remember_token_expires_at"
    t.string   "activation_code",           :limit => 40
    t.datetime "activated_at"
    t.string   "password_reset_code",       :limit => 40
    t.boolean  "enabled",                                  :default => true
    t.string   "identity_url"
    t.integer  "invitation_id"
    t.integer  "invitation_limit"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

end
