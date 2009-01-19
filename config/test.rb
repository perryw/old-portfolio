# Be sure to restart your server when you modify this file
require 'yaml'
require 'rubygems'
require 'json'

# Uncomment below to force Rails into production mode when
# you don't control web/app server and can't set it the proper way
ENV['RAILS_ENV'] ||= 'production'

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.1.0' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

#Load application and environment specific constants
raw_config = File.read(RAILS_ROOT + "/config/config.yml")
APP_CONFIG = YAML.load(raw_config)[RAILS_ENV]
CONFIG=YAML.load(raw_config)

    #:session_key => APP_CONFIG['settings']['session_key'],
    #:secret      => APP_CONFIG['settings']['secret']
