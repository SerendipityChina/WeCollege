const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const LostBiz = require('../../../../biz/lost_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	_setSort: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id) return;

		let params = {
			id,
			sort
		}

		try {
			await cloudHelper.callCloudSumbit('admin/lost_sort', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'LOST_ORDER', sort);
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_del: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/lost_del', params, opts).then(res => {
					pageHelper.delListNode(id, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let idx = pageHelper.dataset(e, 'idx');

		let order = this.data.dataList.list[idx].LOST_ORDER;
		let orderDesc = (order == 0) ? '取消置顶' : '置顶';


		let itemList = ['预览', orderDesc];

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //预览
						let id = pageHelper.dataset(e, 'id');
						wx.navigateTo({
							url: '../../../lost/detail/lost_detail?id=' + id,
						});
						break;
					}
					case 1: { //置顶 
						let sort = (order == 0) ? 9999 : 0;
						e.currentTarget.dataset['sort'] = sort;
						await this._setSort(e);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},

	bindStatusMoreTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let itemList = ['设为进行中', '设为结束', '删除'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: {  
						e.currentTarget.dataset['status'] = 1;
						await this._setStatus(e);
						break;
					}
					case 1: {  
						e.currentTarget.dataset['status'] = 0;
						await this._setStatus(e);
						break;
					}
					case 2: { //删除
						await this._del(e);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},


	_setStatus: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		try {
			await cloudHelper.callCloudSumbit('admin/lost_status', params).then(res => {
				pageHelper.modifyListNode(id, this.data.dataList.list, 'LOST_STATUS', status, '_id');
				this.setData({
					dataList: this.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: function () {
		let cateIdOptions = LostBiz.getCateList();

		let sortItems = [];
		if (cateIdOptions.length > 1) {
			let sortItem1 = [{ label: '分类', type: '', value: 0 }];
			sortItem1 = sortItem1.concat(cateIdOptions);
			sortItems = [sortItem1];
		}

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '进行中', type: 'status', value: 1 },
			{ label: '已结束', type: 'status', value: 0 },
			{ label: '置顶', type: 'top', value: 'top' },
			{ label: '最早ˇ', type: 'sort', value: 'LOST_ADD_TIME|asc' },
			{ label: '点赞数ˇ', type: 'sort', value: 'LOST_LIKE_CNT|desc' },
			{ label: '浏览数ˇ', type: 'sort', value: 'LOST_VIEW_CNT|desc' },
			{ label: '收藏数ˇ', type: 'sort', value: 'LOST_FAV_CNT|desc' },

		];

		this.setData({
			search: '',
			cateIdOptions,
			sortItems,
			sortMenus,
			isLoad: true
		})


	}

})