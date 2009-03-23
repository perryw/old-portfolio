require File.dirname(__FILE__) + '/../test_helper'

class DeliverablesControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:deliverables)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_deliverable
    assert_difference('Deliverable.count') do
      post :create, :deliverable => { }
    end

    assert_redirected_to deliverable_path(assigns(:deliverable))
  end

  def test_should_show_deliverable
    get :show, :id => deliverables(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => deliverables(:one).id
    assert_response :success
  end

  def test_should_update_deliverable
    put :update, :id => deliverables(:one).id, :deliverable => { }
    assert_redirected_to deliverable_path(assigns(:deliverable))
  end

  def test_should_destroy_deliverable
    assert_difference('Deliverable.count', -1) do
      delete :destroy, :id => deliverables(:one).id
    end

    assert_redirected_to deliverables_path
  end
end
