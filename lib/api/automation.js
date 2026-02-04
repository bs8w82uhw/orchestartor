// xyOps API Layer - Automation Manager
// Copyright (c) 2019 - 2026 PixlCore LLC
// Released under the BSD 3-Clause License.
// See the LICENSE.md file in this repository.

const Tools = require("pixl-tools");

class AutomationAPI {
	
	api_get_automation_manager(args, callback) {
		// get automation manager status and recent policy decisions
		var self = this;
		if (!this.requireMaster(args, callback)) return;
		
		this.loadSession(args, function(err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;
			
			callback({
				code: 0,
				manager: self.getAutomationManagerStatus()
			});
		}); // loadSession
	}
	
	api_evaluate_automation_task(args, callback) {
		// run policy evaluation for an automation task and return a decision
		var self = this;
		var params = args.params || {};
		if (!this.requireMaster(args, callback)) return;
		
		this.loadSession(args, function(err, session, user) {
			if (err) return self.doError('session', err.message, callback);
			if (!self.requireAdmin(session, user, callback)) return;
			
			var task = {
				id: params.id || Tools.generateUniqueID('task'),
				title: params.title || '',
				risk_level: params.risk_level || params.risk || 'medium',
				human_approved: !!params.human_approved
			};
			
			var decision = self.evaluateAutomationPolicy(task, user);
			
			self.logTransaction('automation_policy_eval', decision.reason, self.getClientInfo(args, {
				task_id: task.id,
				task_title: task.title,
				risk_level: decision.risk_level,
				allowed: decision.allowed,
				reason: decision.reason,
				keywords: [task.id, decision.risk_level]
			}));
			
			callback({
				code: 0,
				task: task,
				decision: decision
			});
		}); // loadSession
	}
	
}; // class AutomationAPI

module.exports = AutomationAPI;
