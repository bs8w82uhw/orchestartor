// xyOps Automation Manager Layer
// Copyright (c) 2019 - 2026 PixlCore LLC
// Released under the BSD 3-Clause License.
// See the LICENSE.md file in this repository.

const Tools = require("pixl-tools");

class AutomationManager {
	
	automationManagerSetup() {
		// initialize automation manager runtime state
		var conf = this.config.get('automation_manager') || {};
		
		this.automationManager = {
			enabled: !!conf.enabled,
			mode: conf.mode || 'advisory',
			roles: conf.roles || ['planner', 'executor', 'reviewer', 'safety'],
			require_human_approval_for: conf.require_human_approval_for || ['high'],
			recentDecisions: []
		};
		
		this.logDebug(4, "Automation Manager initialized", {
			enabled: this.automationManager.enabled,
			mode: this.automationManager.mode,
			roles: this.automationManager.roles
		});
	}
	
	getAutomationManagerStatus() {
		// get a safe copy of manager status for API responses
		var am = this.automationManager || {};
		return {
			enabled: !!am.enabled,
			mode: am.mode || 'advisory',
			roles: Tools.copyHash(am.roles || [], true),
			require_human_approval_for: Tools.copyHash(am.require_human_approval_for || [], true),
			recentDecisions: Tools.copyHash(am.recentDecisions || [], true)
		};
	}
	
	evaluateAutomationPolicy(task, user) {
		// evaluate a task against automation manager policy
		var am = this.automationManager || {};
		var now = Tools.timeNow(true);
		var risk = this.normalizeAutomationRisk(task && (task.risk_level || task.risk) || 'medium');
		var requires_human_approval = !!(am.require_human_approval_for || []).includes(risk);
		var human_approved = !!(task && task.human_approved);
		var mode = am.mode || 'advisory';
		var allowed = true;
		var reason = "Allowed by policy";
		
		if (!am.enabled) {
			allowed = false;
			reason = "Automation Manager is disabled";
		}
		else if (mode == 'enforced' && requires_human_approval && !human_approved) {
			allowed = false;
			reason = "Human approval required for risk level: " + risk;
		}
		else if (mode == 'advisory' && requires_human_approval && !human_approved) {
			reason = "Advisory mode: human approval recommended for risk level: " + risk;
		}
		
		var decision = {
			id: task && task.id || Tools.generateUniqueID('am'),
			epoch: now,
			risk_level: risk,
			mode: mode,
			requires_human_approval: requires_human_approval,
			human_approved: human_approved,
			allowed: allowed,
			reason: reason,
			task_title: task && task.title || '',
			username: user && user.username || ''
		};
		
		this.recordAutomationDecision(decision);
		return decision;
	}
	
	recordAutomationDecision(decision) {
		// keep a small in-memory ring buffer of latest policy decisions
		if (!this.automationManager) return;
		
		this.automationManager.recentDecisions.unshift(decision);
		if (this.automationManager.recentDecisions.length > 100) {
			this.automationManager.recentDecisions.length = 100;
		}
	}
	
	normalizeAutomationRisk(level) {
		// normalize user-provided risk levels
		level = ('' + (level || 'medium')).toLowerCase();
		if (level.match(/^(low|medium|high)$/)) return level;
		return 'medium';
	}
	
}; // class AutomationManager

module.exports = AutomationManager;
